import { useState } from "react";
import { createClaim } from "../api/claims";
import { useMsal } from '@azure/msal-react';
import { getAccessToken } from '../auth/getToken';
import ReCAPTCHA from "react-google-recaptcha";
import { FormField } from "./FormField";
import type { FormFieldConfig } from "../types/FormFieldConfig";

const claimFormFields: FormFieldConfig[] = [
    { id: 'claimNo', label: 'Claim Number', type: 'text' },
    { id: 'description', label: 'Description', type: 'text' },
    { id: 'claimantId', label: 'Claimant ID', type: 'number' },
    { id: 'amount', label: 'Amount', type: 'number' }
];

export function ClaimForm({ onClaimCreated }: { onClaimCreated: () => void }) {
    const [formValues, setFormValues] = useState<Record<string, string>>({            //Record<string, string>: this is a TypeScript utility type meaning "an object where every key is a string, and every value is a string
        claimNo: '',
        description: '',
        claimantId: '',
        amount: '',
    });

    const { instance, accounts } = useMsal();
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);

    async function handleFieldChange(id: string, value: string) {
        setFormValues(prevValues => ({ ...prevValues, [id]: value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!captchaToken) {
            alert("Please complete the CAPTCHA");
            return;
        }

        const token = await getAccessToken(instance, accounts[0]);
        await createClaim(token, {
            claimNo: formValues.claimNo,
            description: formValues.description,
            claimantId: Number(formValues.claimantId),
            amount: Number(formValues.amount),
            captchaToken,
        });

        setFormValues({ claimNo: '', description: '', claimantId: '', amount: '' });
        onClaimCreated();
    }

    return <form onSubmit={handleSubmit}>
        {claimFormFields.map(field => (
            <FormField
                key={field.id}
                id={field.id}
                label={field.label}
                type={field.type}
                value={formValues[field.id]}
                onChange={value => handleFieldChange(field.id, value)}
            />
        ))}

        <ReCAPTCHA
            sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
            onChange={(token) => setCaptchaToken(token)}
        />

        <button type="submit">Submit Claim</button>
    </form>;
}