#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Change to script directory
cd "$(dirname "$0")"

echo -e "${YELLOW}🚀 Starting Storybook with full cleanup...${NC}"

# Step 1: Kill any existing process on port 6006
echo -e "${YELLOW}🔍 Checking for existing processes on port 6006...${NC}"
if lsof -ti:6006 > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Found existing process, killing it...${NC}"
    lsof -ti:6006 | xargs kill -9 2>/dev/null
    sleep 2
    echo -e "${GREEN}✅ Port 6006 is now free${NC}"
else
    echo -e "${GREEN}✅ Port 6006 is already free${NC}"
fi

# Step 2: Clear all caches
echo -e "${YELLOW}🧹 Clearing Storybook caches...${NC}"
rm -rf node_modules/.cache storybook-static .storybook-out 2>/dev/null
echo -e "${GREEN}✅ Caches cleared${NC}"

# Step 3: Verify required files exist
echo -e "${YELLOW}🔍 Verifying files...${NC}"
MISSING_FILES=0

if [ ! -f "../design-system/src/components/Button/Button.tsx" ]; then
    echo -e "${RED}❌ Missing: Button.tsx${NC}"
    MISSING_FILES=1
fi

if [ ! -f "../design-system/src/styles/variables.css" ]; then
    echo -e "${RED}❌ Missing: variables.css${NC}"
    MISSING_FILES=1
fi

if [ ! -f "stories/Button.stories.tsx" ]; then
    echo -e "${RED}❌ Missing: Button.stories.tsx${NC}"
    MISSING_FILES=1
fi

if [ $MISSING_FILES -eq 1 ]; then
    echo -e "${RED}❌ Cannot start Storybook - missing required files${NC}"
    exit 1
fi

echo -e "${GREEN}✅ All required files present${NC}"

# Step 4: Start Storybook
echo -e "${YELLOW}🎨 Starting Storybook...${NC}"
echo -e "${GREEN}📖 Storybook will be available at: http://localhost:6006${NC}"
echo ""

npm run dev
