import {
  signInWithPopup,
  GoogleAuthProvider,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { auth } from "../../firebase";
import { Helmet } from "react-helmet";
const provider = new GoogleAuthProvider();

export default function Authentication() {
  const handleSignUsingGoogle = async (e) => {
    e.preventDefault();
    try {
      await setPersistence(auth, browserSessionPersistence);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Sign In | Lexys</title>
      </Helmet>
      <form
        onSubmit={handleSignUsingGoogle}
        className="flex flex-col align-middle justify-center items-center text-center py-20"
      >
        <img
          className="h-20 object-contain rounded"
          src="https://ik.imagekit.io/13x54r/_0bd933b9-e3f4-41f5-9306-7e85a54640b7.jpg?updatedAt=1702170800035"
          alt=""
        />

        <p className="text-lg font-medium mt-3">🔐Lexys </p>

        <button
          type="submit"
          className="bg-[#ebf3f9] text-gray-700 w-[20vw] mt-3 mx-auto py-2 text-sm font-medium"
        >
          Sign in with Google
        </button>
      </form>
    </>
  );
}
