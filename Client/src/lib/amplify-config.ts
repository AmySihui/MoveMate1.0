import { Amplify } from "aws-amplify";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolClientId: import.meta.env.VITE_AWS_COGNITO_USER_POOL_CLIENT_ID,
      userPoolId: import.meta.env.VITE_AWS_COGNITO_USER_POOL_ID,
    },
  },
});
