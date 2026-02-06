"use client"

import { motion } from "framer-motion"
import { JwtPayload } from "jsonwebtoken"
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { useRouter } from "next/navigation";


export default function SessionUserProfile({ user }: { user: JwtPayload }) {
    const router = useRouter()

    return (
        <Tippy content={`Continue as ${user.name}`}>
            <motion.div 
                whileHover={{ scale: 0.99 }}
                className="flex flex-col items-center rounded-[10px] bg-white mb-10 cursor-pointer"
                onClick={() => router.push("https://app.noteroom.co")}
            >
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
        </Tippy>
    )
}
