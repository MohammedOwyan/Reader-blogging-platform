import prisma from "./db";


async function GetArticle (id:number){
    const article  = await prisma.article.findUnique({
        where: {id},
        include:{
            author:true
        }
    })
    return article
}

export default GetArticle