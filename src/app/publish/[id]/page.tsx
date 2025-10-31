import Publish from "@/components/publish/publishComponent"

export default async function PublishPage({params}:{params:{id:string}}) {
  const {id} =  await params
  return (
    <Publish id={id}/>
  )
}

