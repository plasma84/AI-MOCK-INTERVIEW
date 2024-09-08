"use client"
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react'
import QuestionsSection from './_components/QuestionsSection';
import RecordAnswerSection from './_components/RecordAnswerSection';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function StartInterview({ params }) {

    const [interviewData, setInterviewData] = useState();
    const [mockInterviewQuestion, setMockInterviewQuestion] = useState([]);
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

    useEffect(() => {
        GetInterviewDetails();
    }, []);

    /**
     * Used to Get Interview Details by MockId/Interview Id
     */
    const GetInterviewDetails = async () => {
        try {
            const result = await db.select().from(MockInterview)
                .where(eq(MockInterview.mockId, params.interviewId));

            if (result && result.length > 0) {
                const jsonMockResp = result[0].jsonMockResp;

                if (jsonMockResp) {
                    try {
                        const parsedJson = JSON.parse(jsonMockResp);
                        setMockInterviewQuestion(parsedJson);
                    } catch (parseError) {
                        console.error("Error parsing JSON:", parseError);
                    }
                } else {
                    console.error("jsonMockResp is undefined or null.");
                }

                setInterviewData(result[0]);
            } else {
                console.error("No data found for this interview.");
            }
        } catch (error) {
            console.error("Error fetching interview details:", error);
        }
    }

    return (
        <div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
                {/* Questions Section */}
                <QuestionsSection
                    mockInterviewQuestion={mockInterviewQuestion}
                    activeQuestionIndex={activeQuestionIndex}
                />

                {/* Video/Audio Recording Section */}
                <RecordAnswerSection
                    mockInterviewQuestion={mockInterviewQuestion}
                    activeQuestionIndex={activeQuestionIndex}
                    interviewData={interviewData}
                />
            </div>
            <div className='flex justify-end gap-6'>
                {activeQuestionIndex > 0 &&
                    <Button onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}>Previous Question</Button>}
                {activeQuestionIndex !== mockInterviewQuestion?.length - 1 &&
                    <Button onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}>Next Question</Button>}
                {activeQuestionIndex === mockInterviewQuestion?.length - 1 &&
                    <Link href={'/dashboard/interview/' + interviewData?.mockId + "/feedback"}>
                        <Button>End Interview</Button>
                    </Link>}
            </div>
        </div>
    )
}

export default StartInterview;
