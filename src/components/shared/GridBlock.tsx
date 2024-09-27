import Image from "next/image";
import React from "react";

export interface GridModel {
  sections: Section[];
}

interface Section {
  grid: number;
  rows: Row[];
}

interface Row {
  areas: Area[];
  config?: { [key: string]: string };
  styles?: { [key: string]: string };
}

interface Area {
  grid: number;
  controls: Control[];
  config?: { [key: string]: string };
  styles?: { [key: string]: string };
}

interface Control {
  editor: {
    view: string;
    name: string;
  };
  value: any;
}

const GridBlock: React.FC<{ model: GridModel }> = ({ model }) => {
  const { sections } = model;
  const oneColumn = sections.length === 1;

  return (
    <div className="umb-grid">
      {oneColumn ? (
        sections.map((section, sectionIndex) => (
          <div key={`section-${sectionIndex}`} className="grid-section">
            {section.rows.map((row, rowIndex) => (
              <Row key={`row-${rowIndex}`} row={row} singleColumn={true} />
            ))}
          </div>
        ))
      ) : (
        <div className="container">
          <div className="row clearfix">
            {sections.map((section, sectionIndex) => (
              <div key={`section-${sectionIndex}`} className="grid-section">
                <div className={`col-md-${section.grid} column`}>
                  {section.rows.map((row, rowIndex) => (
                    <Row
                      key={`row-${rowIndex}`}
                      row={row}
                      singleColumn={false}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface RowProps {
  row: Row;
  singleColumn: boolean;
}

const Row: React.FC<RowProps> = ({ row, singleColumn }) => {
  return (
    <div {...renderElementAttributes(row)}>
      {singleColumn ? (
        <ContainerDiv>
          <div className="row clearfix">
            {row.areas.map((area, areaIndex) => (
              <div
                key={`area-${areaIndex}`}
                className={`col-md-${area.grid} column`}
              >
                <div {...renderElementAttributes(area)}>
                  {area.controls.map((control, controlIndex) => {
                    return (
                      <React.Fragment key={controlIndex}>
                        {control &&
                        control.editor &&
                        control.editor.view === "rte" ? (
                          <RichTextControl
                            key={`control-${controlIndex}`}
                            control={control}
                          />
                        ) : null}
                        {control &&
                        control.editor &&
                        control.editor.view === "media" ? (
                          <Image
                            key={controlIndex}
                            src={control.value.image}
                            alt={control.editor.name}
                            height={1110}
                            width={1110}
                            style={{ width: "100%", height: "auto" }}
                          />
                        ) : null}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </ContainerDiv>
      ) : (
        <div className="row clearfix">
          {row.areas.map((area, areaIndex) => (
            <div
              key={`area-${areaIndex}`}
              className={`col-md-${area.grid} column`}
            >
              <div {...renderElementAttributes(area)}>
                {area.controls.map((control, controlIndex) => {
                  return (
                    <React.Fragment key={controlIndex}>
                      {control &&
                        control.editor &&
                        control.editor.view === "rte" && (
                          <RichTextControl
                            key={`control-${controlIndex}`}
                            control={control}
                          />
                        )}
                      {control &&
                        control.editor &&
                        control.editor.view === "media" && (
                          <Image
                            key={controlIndex}
                            src={control.value.image}
                            alt={control.editor.name}
                            height={1110}
                            width={1110}
                          />
                        )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ContainerDiv = ({ children }: { children: React.ReactNode }) => (
  <div className="container">{children}</div>
);

const renderElementAttributes = (contentItem: Row | Area) => {
  const attrs: { [key: string]: string } = {};
  const { config, styles } = contentItem;

  if (config) {
    Object.entries(config).forEach(([key, value]) => {
      attrs[key] = encodeURIComponent(value);
    });
  }

  if (styles) {
    const cssVals: string[] = [];
    Object.entries(styles).forEach(([key, value]) => {
      if (value) {
        cssVals.push(`${key}:${value};`);
      }
    });
    if (cssVals.length > 0) {
      attrs.style = encodeURIComponent(cssVals.join(" "));
    }
  }

  return attrs;
};

export default GridBlock;

interface ControlProps {
  control: Control;
}

const RichTextControl: React.FC<ControlProps> = ({ control }) => {
  if (!control.value) {
    return null;
  }

  return <div dangerouslySetInnerHTML={{ __html: control.value }} />;
};
