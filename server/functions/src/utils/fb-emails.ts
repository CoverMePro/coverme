import { Auth, sendSignInLinkToEmail } from 'firebase/auth';

interface IEmailInfo {
	email: string;
	firstName: string;
	lastName: string;
	company: string;
	role: string;
	position: string;
}

export const emailSignInForUser = (firebaseAuth: Auth, emailInfo: IEmailInfo) => {
	const { email, firstName, lastName, company, role, position } = emailInfo;

	const actionCodeSettings = {
		// URL you want to redirect back to. The domain (www.example.com) for this
		// URL must be in the authorized domains list in the Firebase Console.
		// TODO: create a variable to set url when needed
		url: `http://localhost:5001/coverme-47dc7/us-central1/api/auth/register-callback?email=${email}&firstName=${firstName}&lastName=${lastName}&company=${company}&role=${role}&position=${position}`,
		// This must be true.
		handleCodeInApp: true
	};

	return sendSignInLinkToEmail(firebaseAuth, email, actionCodeSettings);
};
