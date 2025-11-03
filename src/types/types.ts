import { JwtPayload } from "jsonwebtoken";
import { Article, User } from "@prisma/client";
import { ComponentPropsWithoutRef } from "react";

export type SelectMenuProps = {
    handleChange: (value: 'h1' | 'h2' | 'h3' | 'p') => void;
};
export type userState = {
    authenticated: boolean;
    user?: undefined;
} | {
    authenticated: boolean;
    user: string | JwtPayload;
}


export  interface ArticleData extends Article {
    author: User
}

export interface ArticleComponentProps extends ComponentPropsWithoutRef<"div"> {
    article:ArticleData 
}