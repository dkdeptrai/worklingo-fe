import React, { useEffect, useState } from "react";
import LessonComponent from "./components/LessonComponent";
import FavoriteIcon from "./assets/icons/favorite.svg?react";
import { FlashcardArray } from "react-quizlet-flashcard";
import FlashCardAnswer from "./components/FlashCardAnswer";
import { useParams } from "react-router-dom";
import lessonsService from "./services/lessons.service";
import topicsService from "./services/topics.service";
import userService from "./services/user.service";
import DefaultUserIcon from "./assets/icons/default_user_icon.svg?react";
import UpvoteIcon from "./assets/icons/upvote_icon.svg?react";
import DownvoteIcon from "./assets/icons/downvote_icon.svg?react";
import ratingsService from "./services/ratings.service";
import { useAuth } from "./contexts/AuthContext";
interface FlashcardLearningProps {
  // Define your component props here
}

interface flashcard {
  id: number;
  frontHTML: string;
  backHTML: string;
}

const FlashcardLearning: React.FC<FlashcardLearningProps> = () => {
  const lessonId = useParams<{ id: string }>().id;
  const [lesson, setLesson] = useState();
  const [topic, setTopic] = useState(null);
  const [flashcards, setFlashcards] = useState<flashcard[]>([]);
  const [lessons, setLessons] = useState([]);
  const [author, setAuthor] = useState(null);
  const [upvotes, setUpvotes] = useState();
  const [downvotes, setDownvotes] = useState();
  const [vote, setVote] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const fetchFlashcard = async () => {
    const cards = await lessonsService.getFlashcards(lessonId!);
    setFlashcards(
      cards.map((card: any) => ({
        id: card.id,
        frontHTML: card.question,
        backHTML: card.answer,
      }))
    );
  };

  const fetchLesson = async () => {
    const data = await lessonsService.getLesson(lessonId!);
    setLesson(data);
    setUpvotes(data.numberOfUpVotes);
    setDownvotes(data.numberOfDownVotes);
  };

  const fetchLessons = async () => {
    try {
      if (topic) {
        const data = await topicsService.getLessonsInTopic(topic.id, 0, 10)
          .results;
        console.log("lessons", data);
        setLessons(data);
      }
    } catch (error) {
      console.error("Error fetching lessons: ", error);
      throw error;
    }
  };

  const fetchAuthor = async () => {
    try {
      const user = await userService.getUser(lesson.authorId);
      setAuthor(user);
    } catch (error) {
      console.error("Error fetching author: ", error);
      throw error;
    }
  };

  const handleUpvote = async () => {
    if (!isLoading) {
      setIsLoading(true);
      if (vote === "UPVOTE") {
        await ratingsService.deleteRating(lesson.id, user.id);
        setVote("");
        return;
      }
      setVote("UPVOTE");
      if (vote === "DOWNVOTE") {
        setDownvotes(downvotes - 1);
        await ratingsService.deleteRating(lesson.id, user.id);
      }
      setUpvotes(upvotes + 1);
      const response = await ratingsService.addRating(
        lesson.id,
        "UPVOTE",
        user.id
      );
      setIsLoading(false);
      console.log("response", response);
    }
  };

  const checkRating = async () => {
    console.log("lesson", lesson.id);
    const rating = await ratingsService.checkRating(lesson.id, user.id);
    console.log("rating", rating);

    if (rating === "UPVOTE") {
      setVote("UPVOTE");
    } else if (rating === "DOWNVOTE") {
      setVote("DOWNVOTE");
    }
  };

  const handleDownvote = async () => {
    if (!isLoading) {
      if (vote === "DOWNVOTE") {
        await ratingsService.deleteRating(lesson.id, user.id);
        setVote("");

        return;
      }
      setVote("DOWNVOTE");
      if (vote === "UPVOTE") {
        setUpvotes(upvotes - 1);
        await ratingsService.deleteRating(lesson.id, user.id);
      }
      setDownvotes(downvotes + 1);
      const response = await ratingsService.addRating(
        lesson.id,
        "DOWNVOTE",
        user.id
      );
      setIsLoading(false);
      console.log("response", response);
    }
  };

  useEffect(() => {}, [upvotes, downvotes]);

  useEffect(() => {
    fetchFlashcard();
  }, [lessonId]);
  useEffect(() => {
    if (lesson) {
      fetchAuthor();
      fetchLessons();
      checkRating();
      console.log(lesson.topic);
      // setTopic(lesson.topic);
    }
  }, [lesson]);
  useEffect(() => {
    fetchLesson();
  }, [topic]);

  return (
    lesson &&
    author && (
      <div className="bg-background-color w-full flex flex-row gap-10 px-14">
        <div className="w-3/4 flex flex-col items-start">
          <div className="text-secondary-text-color text-sm font-bold my-2">
            TOPIC
          </div>
          <div className="bg-text-padding-color px-3 py-1 rounded-[3px]">
            {topic ? topic.name : ""}
          </div>
          <div className="w-full flex flex-row gap-12 items-center my-6 ">
            <div className="text-3xl font-semibold">
              {lesson ? lesson.title : ""}
            </div>
            <button className="bg-transparent text-primary-color ml-auto px-4 py-1 rounded-md">
              <FavoriteIcon className="w-6 h-6" />
            </button>
          </div>{" "}
          <div className="w-full h-auto items-center">
            <FlashcardArray
              FlashcardArrayStyle={{
                width: "100%",
                height: "100%",
                fontSize: "2rem",
              }}
              frontContentStyle={{
                width: "100%",
                height: "100%",
                padding: "1rem",
                fontWeight: "semibold",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "var(--light-blue-color)",
              }}
              backContentStyle={{
                width: "100%",
                height: "100%",
                padding: "1rem",
                textAlign: "center",
                fontSize: "1.5rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "var(--light-blue-color)",
              }}
              cards={flashcards}
            />
          </div>
          <div className="flex flex-row my-4 w-full">
            <div className="flex flex-row">
              {author.avatarUrl ? (
                <img
                  className="object-scale-down h-14 w-14 flex-auto rounded-full mr-4"
                  src={author.avatarUrl}
                  alt=""
                />
              ) : (
                <DefaultUserIcon className="h-14 w-14 flex-auto rounded-full mr-4" />
              )}
              <div className="flex flex-col items-start">
                {/* TODO: replace with variable */}
                <div className="text-xl font-medium">{`${author.firstname} ${author.lastname}`}</div>
                <div className="text-lg font-sm">
                  {author.jobTitle || "Teacher"}
                </div>
              </div>
            </div>
            <div className="flex flex-row gap-4 items-center ml-auto">
              <UpvoteIcon
                fill={vote === "UPVOTE" ? "red" : ""}
                onClick={handleUpvote}
                className="w-6 h-6 bg-transparent text-primary-color"
              />
              <div>{upvotes}</div>
              <DownvoteIcon
                fill={vote === "DOWNVOTE" ? "blue" : ""}
                onClick={handleDownvote}
                className="w-6 h-6 bg-transparent text-primary-color"
              />
              <div>{downvotes}</div>
            </div>
          </div>
          <div className="w-full flex flex-col gap-4">
            {flashcards.map((card, index) => (
              <FlashCardAnswer
                key={index}
                question={card.frontHTML}
                answer={card.backHTML}
              />
            ))}
          </div>
        </div>
        <div className="w-1/4 flex flex-col gap-4 items-start">
          <div className="text-xl font-medium">Other lessons in this topic</div>
          {lessons.map(
            (lesson, index) =>
              lesson.id !== Number(lessonId) && (
                <LessonComponent key={index} lesson={lesson} />
              )
          )}
        </div>
      </div>
    )
  );
};

export default FlashcardLearning;
