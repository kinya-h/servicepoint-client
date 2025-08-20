import type { Service } from "../lib/types";
import type { User } from "./user";



export interface Provider {
    id:number;
    user:User
    services: Service[];
  }


