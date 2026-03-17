"use client";

import Image from "next/image";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import type { BlocksContent } from "@strapi/blocks-react-renderer";

interface Props {
  inhoud: string | Record<string, unknown>[];
}

export default function RichTextRenderer({ inhoud }: Props) {
  if (typeof inhoud === "string") {
    return (
      <div className="space-y-4">
        {inhoud.split(/\n\n|\\n\\n/).map((alinea, i) => (
          <p key={i} className="text-base leading-relaxed">
            {alinea}
          </p>
        ))}
      </div>
    );
  }

  return (
    <BlocksRenderer
      content={inhoud as unknown as BlocksContent}
      blocks={{
        paragraph: ({ children }) => (
          <p className="text-base leading-relaxed">{children}</p>
        ),
        heading: ({ children, level }) => {
          const Tag = `h${level}` as keyof JSX.IntrinsicElements;
          const sizes: Record<number, string> = {
            1: "text-2xl font-bold mt-6 mb-2",
            2: "text-xl font-bold mt-5 mb-2",
            3: "text-lg font-semibold mt-4 mb-1",
            4: "text-base font-semibold mt-3 mb-1",
            5: "text-sm font-semibold mt-3 mb-1",
            6: "text-sm font-semibold mt-3 mb-1",
          };
          return (
            <Tag className={`font-sora text-text-primary ${sizes[level] ?? ""}`}>
              {children}
            </Tag>
          );
        },
        list: ({ children, format }) =>
          format === "ordered" ? (
            <ol className="list-decimal list-inside space-y-1">{children}</ol>
          ) : (
            <ul className="list-disc list-inside space-y-1">{children}</ul>
          ),
        "list-item": ({ children }) => <li>{children}</li>,
        quote: ({ children }) => (
          <blockquote className="border-l-4 border-brand pl-4 italic text-text-muted">
            {children}
          </blockquote>
        ),
        code: ({ plainText }) => (
          <pre className="bg-bg border border-border rounded p-4 overflow-x-auto text-sm font-mono">
            <code>{plainText}</code>
          </pre>
        ),
        image: ({ image }) => (
          <figure className="my-4">
            <div className="relative w-full aspect-video rounded overflow-hidden">
              <Image
                src={image.url}
                alt={image.alternativeText ?? ""}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 672px"
              />
            </div>
            {image.caption && (
              <figcaption className="text-xs text-text-muted mt-1 text-center font-sans">
                {image.caption}
              </figcaption>
            )}
          </figure>
        ),
        link: ({ children, url }) => (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand hover:underline"
          >
            {children}
          </a>
        ),
      }}
    />
  );
}
