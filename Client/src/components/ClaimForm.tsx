import { useState } from "react";
import type { CreateClaimRequest } from "../types/CreateClaimRequest";
import { createClaim } from "../api/claims";
import { useMsal } from '@azure/msal-react';
import { getAccessToken } from '../auth/getToken';
import ReCAPTCHA from "react-google-recaptcha";

export function ClaimForm({onClaimCreated}: {onClaimCreated: () => void}) {
    const [claimNo, setClaimNo] = useState('');
    const [description, setDescription] = useState('');
    const [claimantId, setClaimantId] = useState(0);
    const [amount, setAmount] = useState(0);
    const { instance, accounts } = useMsal();
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!captchaToken) {
            alert("Please complete the CAPTCHA");
            return;
        }

        const token = await getAccessToken(instance, accounts[0]);
        await createClaim(token, { claimNo, description, claimantId, amount, captchaToken });

        setClaimNo('');
        setDescription('');
        setClaimantId(0);
        setAmount(0);
        onClaimCreated();
    }

    return <form onSubmit={handleSubmit}>
        <div>
            <label htmlFor="claimNo">Claim Number:</label>
            <input
                type="text"
                id="claimNo"
                value={claimNo}
                onChange={(e) => setClaimNo(e.target.value)}
            />
        </div>
        <div>
            <label htmlFor="description">Description</label>
            <input
                id="description"
                type="text"
                value={description}
                onChange={e => setDescription(e.target.value)}
            />
        </div>

        <div>
            <label htmlFor="claimantId">Claimant ID</label>
            <input
                id="claimantId"
                type="number"
                value={claimantId}
                onChange={e => setClaimantId(Number(e.target.value))}
            />
        </div>

        <div>
            <label htmlFor="amount">Amount</label>
            <input
                id="amount"
                type="number"
                value={amount}
                onChange={e => setAmount(Number(e.target.value))}
            />
        </div>

        <ReCAPTCHA  
            sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
            onChange={(token) => setCaptchaToken(token)}
        />

        <button type="submit">Submit Claim</button>
    </form>;
}