import { authOptions } from '@/lib/authOptions'
import { getServerSession } from 'next-auth'
import { getUserById } from '@/lib/getUserById' 
import Owner from '@/components/profile/owner'



export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  const session = await getServerSession(authOptions);
  const sessionUserId = Number(session?.user?.id)

  // Fetch the page owner's details
  const pageOwner = await getUserById(id);
  const pageOwnerId = pageOwner?.id;

  const isOwner = sessionUserId === pageOwnerId;

  console.log("sessionUserId:", sessionUserId);
  console.log("pageOwnerId:", pageOwnerId);
  console.log("isOwner:", isOwner);


  return (
    <div>
      <Owner pageOwner={pageOwner}/>
    </div>
  )
}