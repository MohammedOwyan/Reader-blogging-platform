import TiptapEditor from "../../components/editor/TiptapEditor";
import { redirect} from "next/navigation";
import { getServerSession } from "next-auth";


export default async function WritePage() {
    
    const session = await getServerSession()
    const isAuth = !!session;

    if(!isAuth){
      redirect("/signup")
    }
    
    

    return (
        <>
        <TiptapEditor />
        </>
    )
}
