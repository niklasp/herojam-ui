"use client";

import { Binary } from "polkadot-api";
import { TxButton } from "../ui/tx-button";
import { useChain } from "@/providers/chain-provider";
import { useChainInfo } from "@/hooks/use-chain-info";

export function UserProfileActionButtons() {
  const { ajuApi } = useChain();
  const { tokenDecimals } = useChainInfo();

  return (
    <>
      <TxButton
        transaction={ajuApi?.tx.System.remark({
          remark: Binary.fromText("Hello, HeroJam!"),
        })}
      >
        Remark &quot;Hello, HeroJam!&quot;
      </TxButton>
      <TxButton
        transaction={ajuApi?.tx.Balances.burn({
          value: BigInt(10 ** (tokenDecimals || 18 - 5)),
          keep_alive: true,
        })}
      >
        Burn 0.0001 AJUN
      </TxButton>
      <TxButton
        transaction={ajuApi?.tx.AwesomeAvatars.claim_treasury({
          season_id: 1,
        })}
      >
        Awesome Avatars Claim Treasury Season 1
      </TxButton>
    </>
  );
}
