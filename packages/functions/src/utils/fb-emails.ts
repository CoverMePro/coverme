import { Auth, sendSignInLinkToEmail, sendPasswordResetEmail } from 'firebase/auth';

/**
 * Sends firebase password reset email to user
 */
export const emailPasswordReset = (firebaseAuth: Auth, email: string) => {
	const actionCodeSettings = {
		url: process.env.WEB_CLIENT_DOMAIN!,
		// This must be true.
		handleCodeInApp: true,
	};
	return sendPasswordResetEmail(firebaseAuth, email, actionCodeSettings);
};
