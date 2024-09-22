"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "../components/ui/button";
import { BackgroundBeams } from "../components/ui/background-beams";
import { TextGenerateEffect } from "../components/ui/text-generate-effect";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Image from "next/image";
import { image } from "framer-motion/client";

const troops = [
  {
    id: 1,
    name: "Barbarian",
    ability: "Melee fighter",
    trainTime: 20,
    maxCount: 5,
    imageUrl: "/barbarian.png",
  },
  {
    id: 2,
    name: "Archer",
    ability: "Ranged attacker",
    trainTime: 25,
    maxCount: 4,
    imageUrl: "/archer.png",
  },
  { id: 3, name: "Giant", ability: "Tank", trainTime: 120, maxCount: 2, imageUrl: "/giant.png" },
  {
    id: 4,
    name: "Wizard",
    ability: "Area damage",
    trainTime: 180,
    maxCount: 2,

  },
];

export default function TrainTroops() {
  const [user, setUser] = useState<any>(null);
  const [trainingQueue, setTrainingQueue] = useState<any[]>([]);
  const [completedTraining, setCompletedTraining] = useState<any[]>([]);
  const supabase = createClientComponentClient();
  const [troops, setTroops] = useState<any[]>([]);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        // Load user's training queue and completed training from Supabase
        const { data: queueData } = await supabase
          .from("training_queue")
          .select("*")
          .eq("user_id", user.id);
        setTrainingQueue(queueData || []);

        const { data: completedData } = await supabase
          .from("completed_training")
          .select("*")
          .eq("user_id", user.id);
        setCompletedTraining(completedData || []);
      }
    };
    getUser();
  }, []);
  useEffect(() => {
    const loadTroops = async () => {
      const fetchedTroops = await fetchTroops();
      setTroops(fetchedTroops);
    };
  
    loadTroops();
  }, []);
  const fetchTroops = async () => {
    const { data: troopsData, error } = await supabase
      .from('troops')
      .select('*')
      .order('id');
  
    if (error) {
      console.error('Error fetching troops:', error);
      return [];
    }
  
    return troopsData;
  };
  interface Troop {
    id: number;
    name: string;
    ability: string;
    trainTime: number;
    maxCount: number;
    image_url: string;
  }

  interface QueueItem {
    id?: number;
    user_id: string;
    troop_id: number;
    start_time: string;
    end_time: string;
  }

  interface User {
    id: string;
    [key: string]: any;
  }

  const addToQueue = async (troop: Troop) => {
    const newQueueItem: QueueItem = {
      user_id: user.id,
      troop_id: troop.id,
      start_time: new Date().toISOString(),
      end_time: new Date(Date.now() + troop.trainTime * 1000).toISOString(),
    };
    const { data, error } = await supabase
      .from("training_queue")
      .insert(newQueueItem)
      .select();
    if (data) {
      setTrainingQueue([...trainingQueue, data[0]]);
    }
  };

  useEffect(() => {
    const timer = setInterval(async () => {
      const now = new Date();
      const completed = trainingQueue.filter(
        (item) => new Date(item.end_time) <= now
      );
      if (completed.length > 0) {
        setTrainingQueue(
          trainingQueue.filter((item) => new Date(item.end_time) > now)
        );
        setCompletedTraining([...completedTraining, ...completed]);

        // Update Supabase
        await supabase
          .from("training_queue")
          .delete()
          .in(
            "id",
            completed.map((item) => item.id)
          );

        await supabase.from("completed_training").insert(completed);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [trainingQueue, completedTraining]);

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <BackgroundBeams />
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 relative z-10">
        <h1 className="text-4xl font-bold mb-8 text-center">
          <TextGenerateEffect words="Train Your Troops" />
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {troops.map((troop) => (
            <div
              key={troop.id}
              className="bg-gray-800 p-4 rounded-lg shadow-lg"
            >
              <Image
                src={troop.imageUrl || "/placeholder.png"} 
                alt={troop.name}
                width={200}
                height={200}
                className="rounded-lg mb-4"
              />
              <h2 className="text-2xl font-bold">{troop.name}</h2>
              <p className="text-center">{troop.ability}</p>
              <p className="text-center">Train Time: {troop.trainTime}s</p>
              <p className="text-center">Max Count: {troop.maxCount}</p>
              <Button
                onClick={() => addToQueue(troop)}
                disabled={
                  trainingQueue.filter((item) => item.troop_id === troop.id)
                    .length >= troop.maxCount
                }
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Train
              </Button>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Training Queue</h2>
          {trainingQueue.map((item) => {
            const troop = troops.find((t) => t.id === item.troop_id);
            return (
              <div
                key={item.id}
                className="bg-gray-800 rounded-xl p-4 mb-4 flex items-center justify-between"
              >
                <div>
                  {troop && <p className="font-bold">{troop.name}</p>}
                  <p className="text-sm">
                    Completes at: {new Date(item.end_time).toLocaleTimeString()}
                  </p>
                </div>
                <motion.div
                  className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Image
                    src="/placeholder.svg"
                    alt="Training"
                    width={32}
                    height={32}
                  />
                </motion.div>
              </div>
            );
          })}
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Completed Training</h2>
          {completedTraining.map((item) => {
            const troop = troops.find((t) => t.id === item.troop_id);
            return (
              <div key={item.id} className="bg-gray-800 rounded-xl p-4 mb-4">
                {troop && <p className="font-bold">{troop.name}</p>}
                <p className="text-sm">
                  Completed at: {new Date(item.end_time).toLocaleTimeString()}
                </p>
              </div>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}
