"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Identicon from "@polkadot/react-identicon";
import { formatBalance, trimAddress } from "@/lib/utils";
import Link from "next/link";
import { usePolkadotExtension } from "@/providers/polkadot-extension-provider";
import { useChainInfo } from "@/hooks/use-chain-info";
import { useAccountInfo } from "@/hooks/use-account-info";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { UserProfileActionButtons } from "./user-profile-action-buttons";

export type UserProfileProps = {
  name: string | undefined;
  address: string | undefined;
  profilePicture: React.ReactNode;
  freeBalance: string | undefined;
  frozenBalance: string | undefined;
};

export function UserProfile() {
  const { selectedAccount } = usePolkadotExtension();
  const accountInfo = useAccountInfo();
  const { tokenDecimals, tokenSymbol } = useChainInfo();

  // if (!selectedAccount)
  //   return (
  //     <div className="items-center justify-center text-scenter">
  //       No account selected. Please login to your{" "}
  //       <Wallet className="inline w-5 h-5 mx-1" /> to continue.
  //     </div>
  //   );

  const user: UserProfileProps = {
    name: selectedAccount?.name ?? "Not connected",
    address: selectedAccount?.address,
    profilePicture: (
      <Identicon value={selectedAccount?.address} size={32} theme="polkadot" />
    ),
    freeBalance: formatBalance({
      value: accountInfo?.data.free,
      decimals: tokenDecimals,
      unit: tokenSymbol,
      options: {
        nDecimals: 4,
      },
    }),
    frozenBalance: formatBalance({
      value: accountInfo?.data.frozen,
      decimals: tokenDecimals,
      unit: tokenSymbol,
      options: {
        nDecimals: 4,
      },
    }),
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(user.address ?? "");
    toast.success("Address copied to clipboard");
  };

  return (
    <Card className="w-full max-w-md overflow-hidden bg-white dark:bg-gray-900 shadow-lg">
      <div className="bg-primary p-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <Identicon value={user.address} size={64} theme="polkadot" />
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold text-white">{user.name}</h2>
            <div className="flex items-center gap-2">
              <p className="text-sm text-blue-100">
                {selectedAccount
                  ? trimAddress(user.address ?? "", 10)
                  : "Not connected"}
              </p>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopyAddress}
                className="p-0 w-3 h-3 hover:bg-transparent"
              >
                {selectedAccount && (
                  <Copy className="text-white dark:text-gray-300 w-2 h-2 !hover:bg-transparent" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <CardContent className="p-6">
        <div className="mb-6 grid grid-cols-2 gap-4 h-20">
          <div className="rounded-md bg-gray-50 dark:bg-gray-800 p-4">
            <p className="text-sm font-medium text-gray-500">Free Balance</p>
            <p className="text-lg font-bold text-gray-900 dark:text-gray-300 ">
              {user.freeBalance}
            </p>
          </div>
          <div className="rounded-md bg-gray-50 dark:bg-gray-800 p-4 h-20">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Frozen Balance
            </p>
            <p className="text-lg font-bold text-gray-900 dark:text-gray-300">
              {user.frozenBalance}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <UserProfileActionButtons />
          <Link
            href={`https://paseo.subscan.io/account/${user.address}`}
            className="w-full"
            target="_blank"
          >
            <Button variant="outline" className="w-full">
              View Account on Subscan
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
