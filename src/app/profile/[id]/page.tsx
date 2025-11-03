import { authOptions } from '@/lib/authOptions'
import { getServerSession } from 'next-auth'
import { getUserById } from '@/lib/getUserById' 
import Owner from '@/components/profile/owner'
import Visitor from '@/components/profile/visitor'

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params

  // Get current session
  const session = await getServerSession(authOptions)
  const sessionUserId = session?.user?.id ? Number(session.user.id) : null

  // Get page owner info
  const pageOwner = await getUserById(id)
  const pageOwnerId = pageOwner ? Number(pageOwner.id) : null

  // Determine if current user is owner
  const isOwner = sessionUserId !== null && pageOwnerId !== null && sessionUserId === pageOwnerId

  // Debug logs
  console.log({
    sessionUserId,
    pageOwnerId,
    isOwner
  })

  // Handle not found
  if (!pageOwner) {
    return <div>User not found</div>
  }

  return (
    <div>
      {isOwner ? (
        <Owner pageOwner={pageOwner} />
      ) : (
        <Visitor pageOwner={pageOwner} />
      )}
    </div>
  )
}
