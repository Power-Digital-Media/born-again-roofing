import React from "react";
import { Metadata } from "next";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";
import ReviewsList from "@/components/ReviewsList";

export const metadata: Metadata = {
  title: "Reviews | Born Again Home Remodeling and Roofing",
  description: "Read verified customer reviews for Born Again Home Remodeling and Roofing. Hear from satisfied clients in Jackson, Brandon, Madison, and Pearl, MS. Call (601) 573-6178.",
  alternates: {
    canonical: "/reviews/"
  }
};

export default function ReviewsPage() {
  return (
    <>
      <LocalBusinessSchema pageTitle="Reviews" pageDescription="Read verified customer reviews for Born Again Home Remodeling and Roofing." path="/reviews/" />
      <ReviewsList />
    </>
  );
}
