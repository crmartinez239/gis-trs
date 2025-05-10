import { Token, TokenError } from "./interfaces.ts";

export async function getTokenFromCode(code: string) {
    const client_id = Deno.env.get("GOTO_CLIENT_ID") ?? "";
    const client_secret = Deno.env.get("GOTO_CLIENT_SECRET") ?? "";
    const redirect_uri = Deno.env.get("CLIENT_REDIRECT_URI") ?? "";
    const token_endpoint = Deno.env.get("GOTO_TOKEN_ENDPOINT") ?? "";
    const auth_token = btoa(`${client_id}:${client_secret}`);

    const headers = new Headers({
        "Authorization": `Basic ${auth_token}`,
        "Content-Type": "application/x-www-form-urlencoded"
    });

    const postData = new URLSearchParams({
        grant_type: "authorization_code",
        redirect_uri: redirect_uri,
        client_id: client_id,
        code: code
    });

    const response = await fetch(token_endpoint, {
        method: "POST",
        headers,
        body: postData
    });

    const body = await response.json();

    console.log("Attempted to get token from code: ", {
        client_id,
        client_secret,
        redirect_uri,
        token_endpoint,
        code,
    });

    switch (response.status) {
        case 200:
            return body as Token;
        case 400:
        case 401: {
            const err: TokenError  = {
                status: response.status,
                error_description: body.error_description as string,
            }
            return err
        }
        default: {
            const err: TokenError  = {
                status: response.status,
                error_description: "Unknown error",
            }
            return err;
        }
    }
}