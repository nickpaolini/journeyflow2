#!/bin/bash

echo "🚀 Preparing JourneyFlow for deployment..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit - JourneyFlow customer journey mapping app"
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already exists"
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local template..."
    cat > .env.local << EOF
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
EOF
    echo "✅ .env.local template created"
    echo "⚠️  Please update .env.local with your actual API keys before deploying"
else
    echo "✅ .env.local already exists"
fi

# Run build to check for any build errors
echo "🔨 Running production build check..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful - project is ready for deployment!"
else
    echo "❌ Build failed - please fix the errors above before deploying"
    exit 1
fi

echo ""
echo "🎉 Deployment preparation complete!"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your actual API keys"
echo "2. Set up Supabase database (see DEPLOYMENT.md)"
echo "3. Push to GitHub: git remote add origin <your-repo-url> && git push -u origin main"
echo "4. Deploy to Vercel: https://vercel.com/new"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions" 