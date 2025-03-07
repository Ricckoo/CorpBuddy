"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Link as LinkIcon, CreditCard } from "lucide-react";
import { useSession } from "next-auth/react";
import Script from "next/script";

// Define types for Plaid Link
interface PlaidLinkOptions {
  token: string;
  onSuccess: (public_token: string, metadata: any) => void;
  onExit: (err: any, metadata: any) => void;
  onEvent: (eventName: string, metadata: any) => void;
}

declare global {
  interface Window {
    Plaid: {
      create: (options: PlaidLinkOptions) => {
        open: () => void;
        exit: () => void;
      };
    };
  }
}

export default function PlaidIntegrationPage() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // Function to get a link token and open Plaid Link
  const handleConnect = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/plaid/create-link-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session?.user?.id || "anonymous",
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to get link token");
      }
      
      console.log("Link token response:", data);
      
      // Initialize Plaid Link with the token
      if (window.Plaid && scriptLoaded) {
        const linkHandler = window.Plaid.create({
          token: data.link_token,
          onSuccess: async (public_token, metadata) => {
            try {
              // Exchange the public token for an access token
              const exchangeResponse = await fetch("/api/plaid/exchange-public-token", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  public_token,
                  userId: session?.user?.id,
                  metadata,
                }),
              });
              
              const exchangeData = await exchangeResponse.json();
              
              if (!exchangeResponse.ok) {
                throw new Error(exchangeData.error || "Failed to exchange token");
              }
              
              // Set mock accounts for demo purposes
              setAccounts([
                {
                  id: "acc_123456",
                  name: "Checking Account",
                  type: "depository",
                  subtype: "checking",
                  balance: 2543.21,
                  currency: "USD"
                },
                {
                  id: "acc_789012",
                  name: "Savings Account",
                  type: "depository",
                  subtype: "savings",
                  balance: 15750.80,
                  currency: "USD"
                },
                {
                  id: "acc_345678",
                  name: "Credit Card",
                  type: "credit",
                  subtype: "credit card",
                  balance: -450.30,
                  currency: "USD"
                }
              ]);
              
              setIsConnected(true);
              setIsLoading(false);
            } catch (err) {
              console.error("Error exchanging public token:", err);
              setError(err instanceof Error ? err.message : "An unknown error occurred");
              setIsLoading(false);
            }
          },
          onExit: (err, metadata) => {
            if (err) {
              setError(err.error_message || "Connection exited with an error");
            }
            setIsLoading(false);
          },
          onEvent: (eventName, metadata) => {
            console.log("Plaid Link event:", eventName, metadata);
          }
        });
        
        linkHandler.open();
      } else {
        console.error("Plaid SDK not loaded or not available");
        throw new Error("Plaid Link SDK not loaded. Please refresh the page and try again.");
      }
    } catch (err) {
      console.error("Error in handleConnect:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      setIsLoading(false);
    }
  };

  return (
    <>
      <Script 
        src="https://cdn.plaid.com/link/v2/stable/link-initialize.js" 
        onLoad={() => {
          console.log("Plaid Link script loaded successfully");
          setScriptLoaded(true);
        }}
        onError={() => {
          console.error("Failed to load Plaid Link script");
          setError("Failed to load Plaid Link script. Please refresh the page.");
        }}
      />
      
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Plaid Integration</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <LinkIcon className="mr-2 h-5 w-5" />
              Connect Your Financial Accounts
            </CardTitle>
            <CardDescription>
              Securely connect your bank accounts to enable financial analysis by the CFO agent.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isConnected ? (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Connected!</AlertTitle>
                <AlertDescription className="text-green-700">
                  Your financial accounts have been successfully connected. The CFO agent can now analyze your data.
                </AlertDescription>
              </Alert>
            ) : error ? (
              <Alert className="bg-red-50 border-red-200">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertTitle className="text-red-800">Error</AlertTitle>
                <AlertDescription className="text-red-700">
                  {error}
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4">
                <p>
                  Connect your bank accounts to enable the CFO agent to analyze your financial data and provide insights.
                </p>
                <p>
                  We use Plaid to securely connect to your financial institutions. Your credentials are never stored on our servers.
                </p>
                <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
                  <p className="text-sm text-blue-700">
                    <strong>Note:</strong> You'll need to set up your Plaid API keys in the environment variables for this to work.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleConnect} 
              disabled={isLoading || isConnected || !scriptLoaded}
              className="w-full"
            >
              {isLoading ? "Connecting..." : isConnected ? "Connected" : "Connect Bank Accounts"}
            </Button>
          </CardFooter>
        </Card>
        
        {isConnected && accounts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Connected Accounts</CardTitle>
              <CardDescription>
                These are the financial accounts you've connected.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {accounts.map(account => (
                  <div key={account.id} className="flex items-start p-4 border rounded-md">
                    <div className="mr-4 mt-1">
                      <CreditCard className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{account.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {account.subtype.charAt(0).toUpperCase() + account.subtype.slice(1)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${account.balance < 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {account.balance < 0 ? '-' : ''}${Math.abs(account.balance).toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">{account.currency}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
} 