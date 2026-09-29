#!/bin/bash
git show HEAD:src/components/BentoGrid.tsx > old_bento.tsx
diff old_bento.tsx src/components/BentoGrid.tsx
