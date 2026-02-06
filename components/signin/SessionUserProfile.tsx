"use client"

import {motion} from "framer-motion"
import { JwtPayload } from "jsonwebtoken"

export default function SessionUserProfile({ user }: { user: JwtPayload }) {
    return (
        <motion.div 
            whileHover={{ scale: 0.99 }}
            className="flex flex-col items-center rounded-[10px] bg-white mb-10 cursor-pointer
        ">
            <div className="profile-image overflow-hidden rounded-[10px_10px_0_0] w-50 h-50">
                <img
                    src={user.profileImageUrl}
                    alt="Name"
                    className="object-cover w-full h-full"
                />
            </div>
            <div className="user-fullname p-3">
                <span className="font-inter text-lg">{user.name}</span>
            </div>
        </motion.div>
    )
}
