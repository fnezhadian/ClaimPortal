import { useState } from "react";
import type { CreateClaimRequest } from "../types/CreateClaimRequest";
import { createClaim } from "../api/claims";

export function ClaimForm({onClaimCreated}: {onClaimCreated: () => void}) {
    const [claimNo, setClaimNo] = useState('');
    const [description, setDescription] = useState('');
    const [claimantId, setClaimantId] = useState(0);
    const [amount, setAmount] = useState(0);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        await createClaim({ claimNo, description, claimantId, amount });

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

        <button type="submit">Submit Claim</button>
    </form>;
}