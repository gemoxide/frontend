export interface User {
    type: string;
    id: number;
    attributes: {
        email: string;
        name: string;
    };
    relationships: UserRelationships;
}

export interface UserRelationships {
    addresses: UserAddresses;
}

export interface UserAddresses {
    type: string;
    id: number;
    attributes: {
        address: string;
        city: string;
        state: string;
        country: string;
        zip: string;
        phone: string;
    };
}

export interface UserCredentials {
    access_token: string;
    token_type: string;
    expires_in: number;
    user: {
        id: number;
        email: string;
        name: string;
    };
}