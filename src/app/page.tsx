import { redirect } from 'next/navigation'

export default function HomePage() {
  // Redirigir automáticamente a /nexus
  redirect('/nexus')
}
