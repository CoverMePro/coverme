import { Auth, sendSignInLinkToEmail, sendPasswordResetEmail } from 'firebase/auth';

import { WEB_CLIENT_DOMAIN, SERVER_DOMAIN } from '../constants';

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
        url: `${SERVER_DOMAIN}/auth/register-callback?email=${email}&firstName=${firstName}&lastName=${lastName}&company=${company}&role=${role}&position=${position}`,
        // This must be true.
        handleCodeInApp: true,
    };

    return sendSignInLinkToEmail(firebaseAuth, email, actionCodeSettings);
};

export const emailPasswordReset = (firebaseAuth: Auth, email: string) => {
    const actionCodeSettings = {
        url: WEB_CLIENT_DOMAIN,
        // This must be true.
        handleCodeInApp: true,
    };
    return sendPasswordResetEmail(firebaseAuth, email, actionCodeSettings);
};
