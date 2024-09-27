import { AreaData } from "@/lib/context/filterTypes";
import React, { useCallback, useEffect, useState } from "react";

type AreaProps = {
  areas: AreaData[];
  onChange: (selected: string) => void; // Only selected values are passed to the parent
  initialSelected?: string;
};

const Area: React.FC<AreaProps> = ({ areas, onChange, initialSelected }) => {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [activeRegion, setActiveRegion] = useState<boolean>(false);
  const [activeExpanders, setActiveExpanders] = useState<Set<string>>(
    new Set()
  );
  const [displayValue, setDisplayValue] = useState<string>("Alle Gebiete");

  useEffect(() => {
    if (initialSelected) {
      const selectedIds = new Set<string>(initialSelected.split(","));
      const newCheckedItems = new Set<string>();

      const applyInitialSelection = (nodes: AreaData[]) => {
        nodes.forEach((node) => {
          if (selectedIds.has(node.id)) {
            newCheckedItems.add(node.id);
            if (node.children) {
              selectAllChildren(node.children, newCheckedItems);
            }
          } else if (node.children) {
            applyInitialSelection(node.children);
          }
        });
      };

      const selectAllChildren = (
        children: AreaData[],
        checkedItemsSet: Set<string>
      ) => {
        children.forEach((child) => {
          checkedItemsSet.add(child.id);
          if (child.children) {
            selectAllChildren(child.children, checkedItemsSet);
          }
        });
      };

      applyInitialSelection(areas);
      setCheckedItems(newCheckedItems);
      const selectedItems = getSelectedItems(areas, newCheckedItems);
      setDisplayValue(getDisplayValue(areas, selectedItems));
    }
  }, [initialSelected, areas]);

  const handleCheckboxChange = (
    id: string,
    isChecked: boolean,
    children: AreaData[] | null
  ) => {
    const updatedCheckedItems = new Set(checkedItems);

    const updateChildren = (children: AreaData[], check: boolean) => {
      children.forEach((child) => {
        if (check) {
          updatedCheckedItems.add(child.id);
        } else {
          updatedCheckedItems.delete(child.id);
        }
        if (child.children) {
          updateChildren(child.children, check);
        }
      });
    };

    const updateParent = (id: string) => {
      const parent = findParent(areas, id);
      if (parent && parent.children) {
        const allChildrenChecked = parent.children.every((child) =>
          updatedCheckedItems.has(child.id)
        );
        if (allChildrenChecked) {
          updatedCheckedItems.add(parent.id);
        } else {
          updatedCheckedItems.delete(parent.id);
        }
      }
    };

    if (isChecked) {
      updatedCheckedItems.add(id);
      if (children) {
        updateChildren(children, true);
      }
      updateParent(id);
    } else {
      updatedCheckedItems.delete(id);
      if (children) {
        updateChildren(children, false);
      }
      updateParent(id);
    }

    setCheckedItems(updatedCheckedItems);

    const selectedItems = getSelectedItems(areas, updatedCheckedItems);
    const newDisplayValue = getDisplayValue(areas, selectedItems);
    setDisplayValue(newDisplayValue);

    // Only selected values are sent to the parent
    onChange(selectedItems.join(","));
  };

  const findParent = (nodes: AreaData[], childId: string): AreaData | null => {
    for (const node of nodes) {
      if (
        node.children &&
        node.children.some((child) => child.id === childId)
      ) {
        return node;
      }
      if (node.children) {
        const found = findParent(node.children, childId);
        if (found) return found;
      }
    }
    return null;
  };

  const getCheckboxClass = (node: AreaData) => {
    if (!node.children || node.children.length === 0) {
      return checkedItems.has(node.id) ? "custom-checked" : "custom-unchecked";
    }

    const childIds = node.children.map((child) => child.id);
    const allChecked = childIds.every((id) => checkedItems.has(id));
    const someChecked = childIds.some((id) => checkedItems.has(id));

    if (allChecked) {
      return "custom-checked";
    } else if (someChecked) {
      return "custom-indeterminate";
    } else {
      return "custom-unchecked";
    }
  };

  const getSelectedItems = (
    nodes: AreaData[],
    checkedItemsSet: Set<string>
  ): string[] => {
    const selected = new Set<string>();

    const processNodes = (nodes: AreaData[]) => {
      nodes.forEach((node) => {
        if (node.children && node.children.length > 0) {
          const childIds = node.children.map((child) => child.id);
          const allChildrenChecked = childIds.every((id) =>
            checkedItemsSet.has(id)
          );

          if (allChildrenChecked) {
            selected.add(node.id);
          } else {
            processNodes(node.children);
            node.children.forEach((child) => {
              if (checkedItemsSet.has(child.id)) {
                selected.add(child.id);
              }
            });
          }
        } else if (checkedItemsSet.has(node.id)) {
          selected.add(node.id);
        }
      });
    };

    processNodes(nodes);
    return Array.from(selected);
  };

  const getDisplayValue = (
    areas: AreaData[],
    selectedItems: string[]
  ): string => {
    if (selectedItems.length === 0) {
      return "Nein ausgewählt";
    }

    let firstParentTitle = "";
    let found = false;

    const traverseAndFindFirstParent = (nodes: AreaData[]): boolean => {
      for (const node of nodes) {
        if (selectedItems.includes(node.id)) {
          firstParentTitle = node.title;
          return true; // Stop traversal as soon as we find the first match
        }
        if (node.children && traverseAndFindFirstParent(node.children)) {
          return true;
        }
      }
      return false;
    };

    traverseAndFindFirstParent(areas);

    // Calculate the count of remaining selected items
    const remainingCount = selectedItems.length - 1;

    return remainingCount > 0
      ? `${firstParentTitle} (+${remainingCount})`
      : firstParentTitle || "Nein ausgewählt";
  };

  const renderTree = (nodes: AreaData[]) => {
    return (
      <ul className="treeview">
        {nodes.map((node) => (
          <li key={node.id}>
            {node.children && node.children.length > 0 && (
              <div
                className={`expander ${
                  activeExpanders.has(node.id) ? "active" : ""
                }`}
                onClick={(e) => handleExpanderClick(node.id, e)}
              ></div>
            )}
            <input
              type="checkbox"
              name={node.id}
              id={node.id}
              checked={checkedItems.has(node.id)}
              onChange={(e) =>
                handleCheckboxChange(node.id, e.target.checked, node.children)
              }
            />
            <label htmlFor={node.id} className={getCheckboxClass(node)}>
              {node.title}
            </label>
            {node.children &&
              node.children.length > 0 &&
              activeExpanders.has(node.id) &&
              renderTree(node.children)}
          </li>
        ))}
      </ul>
    );
  };

  const handleExpanderClick = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveExpanders((prev) => {
      const newActiveExpanders = new Set(prev);
      if (newActiveExpanders.has(id)) {
        newActiveExpanders.delete(id);
      } else {
        newActiveExpanders.add(id);
      }
      return newActiveExpanders;
    });
  }, []);

  const handleRegionClick = () => {
    setActiveRegion((prev) => !prev);
  };

  const handleRegionContentClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <div
      className={`search-item region ${activeRegion ? "active" : ""}`}
      onClick={handleRegionClick}
    >
      <span className="input-icon">
        <i className="icon flaticon-location-pin"></i>
      </span>
      <div className="form-control">{displayValue}</div>
      {activeRegion && (
        <div
          className="region-checkbox-tree"
          onClick={handleRegionContentClick}
        >
          {areas.length ? renderTree(areas) : null}
        </div>
      )}
    </div>
  );
};

export default Area;
