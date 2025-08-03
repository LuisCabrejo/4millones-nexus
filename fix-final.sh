#!/bin/bash

echo "🔧 Corrigiendo los últimos 4 errores específicos"

# Error 1: Corregir layout.tsx - cambiar .email por .correo_electronico
echo "📝 Corrigiendo layout.tsx..."
sed -i '' 's/userProfile\.email/userProfile.correo_electronico/g' src/app/\(main\)/layout.tsx

# Error 2: Corregir MobileHeader.tsx - cambiar .email por .correo_electronico  
echo "📝 Corrigiendo MobileHeader.tsx..."
sed -i '' 's/userProfile\.email/userProfile.correo_electronico/g' src/components/MobileHeader.tsx

# Error 3: Corregir Sidebar.tsx - cambiar .email por .correo_electronico
echo "📝 Corrigiendo Sidebar.tsx..."
sed -i '' 's/userProfile\.email/userProfile.correo_electronico/g' src/components/Sidebar.tsx

# Error 4: Corregir login page - quitar línea problemática
echo "📝 Corrigiendo login page..."
sed -i '' '/await authService\.signUp/d' src/app/auth/login/page.tsx

echo "✅ Los 4 errores han sido corregidos"
echo "🎯 Verificando resultado..."

