"use client";

import { BlockSettings } from "@/type/content";
import { generateBlockClassNames } from "@/utils/fns";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

// types.ts
export type ContentBlock = {
  content: {
    contentType: string;
    id: string;
    properties: {
      accordionGroup?: {
        urlSegment: string;
        children: {
          id: string;
          title: string;
          headingTag: string;
          mainText: {
            markup: string;
            blocks: any[];
          };
          urlSegment: string;
        }[];
      } | null;
      items: {
        items: {
          content: {
            contentType: string;
            id: string;
            properties: {
              title: string;
              mainText: {
                markup: string;
                blocks: any[];
              };
              headingTag: string;
            };
          };
          settings: any | null;
        }[];
      };
      textSize: string;
    };
  };
  settings: BlockSettings;
};

interface AccordionSectionProps {
  contentBlock: ContentBlock;
}

const AccordionSection: React.FC<AccordionSectionProps> = ({
  contentBlock,
}) => {
  const { content, settings } = contentBlock;
  const { accordionGroup, items, textSize } = content.properties;

  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const renderAccordionGroup = () => {
    if (!accordionGroup) return null;

    const accordionGroupItems = accordionGroup?.children;

    if (!accordionGroupItems || !accordionGroupItems.length) return null;

    return (
      <div
        className="accordion md-accordion"
        role="tablist"
        aria-multiselectable="true"
        id={accordionGroup?.urlSegment}
      >
        {accordionGroupItems.map((accordionGroupItem) => (
          <AccordionItem
            key={accordionGroupItem.id}
            id={accordionGroupItem.urlSegment}
            title={accordionGroupItem.title}
            headingTag={accordionGroupItem.headingTag}
            content={accordionGroupItem.mainText.markup}
            parentId={accordionGroup?.urlSegment}
            isOpen={openAccordion === accordionGroupItem.urlSegment}
            onToggle={() => {
              setOpenAccordion((prev) =>
                prev === accordionGroupItem.urlSegment
                  ? null
                  : accordionGroupItem.urlSegment
              );
            }}
          />
        ))}
      </div>
    );
  };

  const renderAccordionItems = () => {
    if (!items || !items.items.length) return null;

    const groupId = `accg-${content.id.substring(0, 6)}`;

    return (
      <div
        className="accordion md-accordion"
        role="tablist"
        aria-multiselectable="true"
        id={groupId}
      >
        {items.items.map((item) => (
          <AccordionItem
            key={item.content.id}
            id={`acc-${item.content.id.substring(0, 6)}`}
            title={item.content.properties.title}
            headingTag={item.content.properties.headingTag}
            content={item.content.properties.mainText.markup}
            parentId={groupId}
            isOpen={openAccordion === `acc-${item.content.id.substring(0, 6)}`}
            onToggle={() => {
              setOpenAccordion((prev) =>
                prev === `acc-${item.content.id.substring(0, 6)}`
                  ? null
                  : `acc-${item.content.id.substring(0, 6)}`
              );
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <section
      id={settings.properties.anchorName}
      className={`section__accordion ${generateBlockClassNames(
        settings.properties
      )} ${settings.properties.customCssClass} ${
        textSize ? `text-size-${textSize.toLowerCase()}` : ""
      }`}
    >
      <div className="container">
        {renderAccordionGroup()}
        {renderAccordionItems()}
      </div>
    </section>
  );
};

interface AccordionItemProps {
  id: string;
  title: string;
  headingTag: string;
  content: string;
  parentId: string;
  isOpen: boolean;
  onToggle: () => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({
  id,
  title,
  headingTag,
  content,
  parentId,
  isOpen,
  onToggle,
}) => {
  const accordionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && accordionRef.current) {
      setTimeout(() => {
        const headerHeight =
          document.querySelector("header")?.offsetHeight || 0;
        if (accordionRef.current) {
          window.scrollTo({
            top:
              accordionRef.current.getBoundingClientRect().top +
              window.scrollY -
              headerHeight,
            behavior: "smooth",
          });
        }
      }, 200);
    }
  }, [isOpen]);

  const titleContent = (
    <strong>
      {title}
      <i className="icon-chevron-down"></i>
    </strong>
  );

  return (
    <div className="card" ref={accordionRef}>
      <div className="card-header" role="tab" id={id}>
        <Link
          href="#"
          className={`collapsed ${isOpen ? "" : "collapsed"}`}
          data-toggle="collapse"
          data-parent={`#${parentId}`}
          aria-expanded={isOpen}
          aria-controls={`${id}_body`}
          onClick={(e) => {
            e.preventDefault();
            onToggle();
          }}
        >
          {getHeadingTag(headingTag, `card-title mb-0`, titleContent)}
        </Link>
      </div>
      <div
        id={`${id}_body`}
        className={`collapse ${isOpen ? "show" : ""}`}
        role="tabpanel"
        aria-labelledby={id}
        data-parent={`#${parentId}`}
      >
        <div
          className="card-body"
          dangerouslySetInnerHTML={{ __html: content }}
        ></div>
      </div>
    </div>
  );
};

const getHeadingTag = (
  tag: string,
  className?: string,
  content?: React.ReactNode
) => {
  const headingTag = tag.split(" ")[0].toLowerCase();
  const Component = headingTag.startsWith("h")
    ? `h${headingTag.slice(1)}`
    : "p";

  return React.createElement(Component, { className }, content || []);
};

export default AccordionSection;
