"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import AvailabilityCalendar from "@/components/AvailabilityCalendar";

interface TimeSlot {
  id?: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

interface TeacherProfile {
  id: string;
}

export default function AvailabilityPage() {
  const { data: session } = useSession();
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile | null>(null);
  const [availabilities, setAvailabilities] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeacherProfile = async () => {
      if (!session?.user.id) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch the teacher profile
        const profileResponse = await fetch(`/api/users/${session.user.id}`);
        if (!profileResponse.ok) {
          throw new Error("Failed to fetch teacher profile");
        }
        const profileData = await profileResponse.json();
        
        if (!profileData.teacherProfile) {
          throw new Error("Teacher profile not found");
        }
        
        setTeacherProfile(profileData.teacherProfile);
        
        // Fetch the teacher's availabilities
        const availabilityResponse = await fetch(`/api/teachers/${profileData.teacherProfile.id}/availability`);
        if (!availabilityResponse.ok) {
          throw new Error("Failed to fetch availabilities");
        }
        const availabilityData = await availabilityResponse.json();
        
        // If no availabilities found, create a default set
        if (!availabilityData.length) {
          // Default to no availabilities - teacher will need to set them
          setAvailabilities([]);
        } else {
          setAvailabilities(availabilityData);
        }
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeacherProfile();
  }, [session]);

  const handleSaveAvailability = async (slots: TimeSlot[]) => {
    try {
      if (!teacherProfile) return;
      
      setIsSaving(true);
      setError(null);
      setSuccessMessage(null);
      
      const response = await fetch(`/api/teachers/${teacherProfile.id}/availability`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(slots),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save availability");
      }
      
      const data = await response.json();
      setAvailabilities(data.availabilities);
      setSuccessMessage("Your availability schedule has been saved successfully!");
      
      // Hide the success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-4 rounded-md">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Availability</h1>
      </div>
      
      {successMessage && (
        <div className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 p-4 rounded-md">
          {successMessage}
        </div>
      )}
      
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Weekly Schedule</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Set your regular weekly availability for teaching. Students will only be able to book lessons during these times.
          </p>
          
          <AvailabilityCalendar 
            initialAvailability={availabilities}
            onSave={handleSaveAvailability}
            isSaving={isSaving}
          />
        </div>
      </Card>
      
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Tips for Setting Your Schedule</h2>
        <div className="space-y-3 text-gray-600 dark:text-gray-400">
          <p>• Set consistent hours each day to make it easier for students to remember when you're available.</p>
          <p>• Consider including some evening or weekend hours to accommodate students with daytime commitments.</p>
          <p>• You can always update your schedule as needed, but try to give students advance notice of any changes.</p>
          <p>• If you need to take a break from teaching, use the "Pause Bookings" feature on your dashboard instead of removing all your available hours.</p>
        </div>
      </Card>
    </div>
  );
}
