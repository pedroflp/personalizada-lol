import { NextRequest, NextResponse } from "next/server";
import { signInAnonymously, signInWithEmailAndPassword } from 'firebase/auth'
import { addDoc, collection, doc, setDoc } from 'firebase/firestore'
import { auth, firestore } from "@/services/firebase";
import { cookies } from "next/headers";
import { cookiesKeys } from "@/constants/cookies";
import { collections } from "@/services/constants";
import { parseUsernameToEmail } from "@/utils/parseUsername";

export async function POST(request: NextRequest) {
  try {
    const body: { username: string, password: string } = await request.json();
    const email = parseUsernameToEmail(body.username);
    
    const response = await signInWithEmailAndPassword(auth, email, body.password);
    const { token } = await response.user.getIdTokenResult();

    cookies().set(cookiesKeys.TOKEN, token);

    const col = collection(firestore, collections.USERS)
    await setDoc(doc(col, response.user.uid), {
      name: body.username ?? "",
      id: response.user.uid,
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      token,
      userId: response.user.uid
    })
  } catch (error) {
    return NextResponse.error();
  }
}