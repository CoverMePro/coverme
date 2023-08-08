import { Auth, sendSignInLinkToEmail, sendPasswordResetEmail } from 'firebase/auth';

/**
 * Sends a register email to user
 * for now its firebase template signIn email but will look into better options for more custom tailored emails
 */
export const emailSignInForUser = (firebaseAuth: Auth, email: string) => {
	const actionCodeSettings = {
		url: `${process.env.LOCAL_SERVER_DOMAIN}/auth/register-callback?email=${email}`,

		// This must be true. Do not truly know why
		handleCodeInApp: true,
	};

	return sendSignInLinkToEmail(firebaseAuth, email, actionCodeSettings);
};

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
