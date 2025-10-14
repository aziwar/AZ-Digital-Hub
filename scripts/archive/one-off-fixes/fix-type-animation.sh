#!/bin/bash

echo "=== AZ Digital Hub - TypeAnimation Fix ==="
echo ""

node scripts/fix-type-animation.js

if [ $? -ne 0 ]; then
  echo ""
  echo "Fix script encountered an error. Please check the output above."
  exit 1
fi

echo ""
echo "=== Fix completed successfully! ==="
echo "To verify, run: npm run dev"
