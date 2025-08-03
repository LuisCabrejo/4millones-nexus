#!/bin/bash

echo "🔧 Corrigiendo los últimos 3 errores específicos"

# Error 1: Corregir register page para incluir whatsapp en signUp
echo "📝 Corrigiendo register page..."
sed -i '' 's/await authService\.signUp(formData\.fullName, formData\.email, formData\.password)/await authService.signUp(formData.email, formData.password, formData.fullName, formData.whatsapp)/' src/app/auth/register/page.tsx

# Error 2: Corregir MobileHeader - asegurar import correcto
echo "📝 Corrigiendo MobileHeader imports..."
sed -i '' '1i\
import { UserProfile } from '"'"'@/lib/supabase'"'"'
' src/components/MobileHeader.tsx

# Error 3: Corregir layout principal - asegurar import correcto  
echo "📝 Corrigiendo layout imports..."
sed -i '' '1i\
import { UserProfile } from '"'"'@/lib/supabase'"'"'
' src/app/\(main\)/layout.tsx

echo "✅ Los últimos 3 errores corregidos"
echo "🎯 Verificando resultado final..."

