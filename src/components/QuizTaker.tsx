import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { Quiz } from '@/types/quiz';
import { useAuth } from '@/contexts/AuthContext';
import { dummyApi } from '@/services/dummyApi';
import { useToast } from '@/hooks/use-toast';

interface QuizTakerProps {
  quiz: Quiz;
  onComplete: (score: number) => void;
  onBack: () => void;
}

export const QuizTaker: React.FC<QuizTakerProps> = ({ quiz, onComplete, onBack }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const submission = await dummyApi.submitQuiz({
        quiz_id: quiz.id,
        student_id: user?.id || '1',
        answers
      });

      setScore(submission.score);
      setShowResults(true);
      
      toast({
        title: "Quiz Submitted",
        description: `You scored ${submission.score}%!`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit quiz",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;
  const currentQ = quiz.questions[currentQuestion];
  const allAnswered = quiz.questions.every(q => answers[q.id]);

  if (showResults) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Quiz Complete!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">{score}%</div>
              <p className="text-muted-foreground">
                You got {quiz.questions.filter(q => answers[q.id] === q.correct_answer).length} out of {quiz.questions.length} questions correct
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium">Review:</h3>
              {quiz.questions.map((question, index) => {
                const isCorrect = answers[question.id] === question.correct_answer;
                return (
                  <div key={question.id} className="text-left p-3 border rounded">
                    <p className="font-medium">Q{index + 1}: {question.question_text}</p>
                    <p className={`text-sm ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                      Your answer: {answers[question.id] || 'Not answered'}
                    </p>
                    {!isCorrect && (
                      <p className="text-sm text-green-600">
                        Correct answer: {question.correct_answer}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <Button onClick={() => { onComplete(score); onBack(); }} className="w-full">
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{quiz.title}</h1>
          <p className="text-muted-foreground">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </p>
        </div>
      </div>

      <Progress value={progress} className="w-full" />

      <Card>
        <CardHeader>
          <CardTitle>Question {currentQuestion + 1}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg">{currentQ.question_text}</p>
          
          <RadioGroup
            value={answers[currentQ.id] || ''}
            onValueChange={(value) => handleAnswerChange(currentQ.id, value)}
          >
            {currentQ.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>

          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {currentQuestion === quiz.questions.length - 1 ? (
              <Button 
                onClick={handleSubmit}
                disabled={!allAnswered || isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
              </Button>
            ) : (
              <Button 
                onClick={handleNext}
                disabled={currentQuestion === quiz.questions.length - 1}
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Progress: {Math.round(progress)}%</span>
            <span>Answered: {Object.keys(answers).length}/{quiz.questions.length}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};