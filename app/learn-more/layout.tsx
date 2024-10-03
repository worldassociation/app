import { DocsLayout } from 'fumadocs-ui/layout';
import { pageTree } from 'app/source';
import type { ReactNode } from 'react';

export default function RootDocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="w-[100dvw]">
      <DocsLayout
        tree={pageTree}
        nav={{
          title: (
            <>
              <div className="box-border size-6 rounded-full border-4 border-foreground"></div>
              <p className="text-lg font-extrabold">World Association</p>
            </>
          )
        }}
      >
        {children}
      </DocsLayout>
    </div>
  );
}
