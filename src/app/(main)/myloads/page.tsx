"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { LoadsDataTable } from "./data-table";
import LoadDrawer from "@/components/global/loads/LoadDrawer";
import { getLoads } from "@/actions/actions";
import { Load } from "./data-table";

export default function LoadsPage() {
  const [loads, setLoads] = useState<Load[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const fetchLoads = async () => {
      try {
        const loads = await getLoads();
        setLoads(loads as Load[]);
      } catch (error) {
        console.error("Error fetching loads:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLoads();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            ტვირთების კონტროლი
          </h1>
          <p className="text-muted-foreground">
            ნახეთ და აკონტროლეთ თქვენი გამომუშავებული თანხა
          </p>
        </div>
        <Button onClick={() => setDrawerOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> ტვირთის დამატება
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>სულ ტვირთები</CardTitle>
            <CardDescription>ჯამში აქტიური ტვირთები</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loads.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>გადაუხდელი ტვირთები</CardTitle>
            <CardDescription>
              ტვირთები რომლის თანხასაც ველოდებით
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loads.filter((load) => !load.isPaymentReceived).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>ტვირთების თანხა</CardTitle>
            <CardDescription>ჯამი</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(
                loads.reduce((sum, load) => sum + parseFloat(load.price), 0)
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <LoadsDataTable data={loads} />
          <LoadDrawer drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
        </>
      )}
    </div>
  );
}
