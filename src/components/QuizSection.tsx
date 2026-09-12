import React, { useState } from 'react';
import { QuizQuestion } from '../config';
import { Sparkles, Trophy, RotateCcw, Heart, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../utils/audio';

interface QuizSectionProps {
  title: string;
  subtitle: string;
  questions: QuizQuestion[];
  completedBadge: string;
  completedMessage: string;
}

export const QuizSection: React.FC<QuizSectionProps> = ({
  title,
  subtitle,
  questions,
  completedBadge,
  completedMessage,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);

  const currentQ = questions[currentQuestionIndex];

  const handleSelectOption = (optionIndex: number) => {
    soundEngine.playCardFlip();
    const nextAnswers = {
      ...selectedAnswers,
      [currentQuestionIndex]: optionIndex,
    };
    setSelectedAnswers(nextAnswers);

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setShowResult(true);
        soundEngine.playCelebrationChime();
        confetti({
          particleCount: 50,
          spread: 60,
          colors: ['#F472B6', '#C084FC', '#FBBF24']
        });
      }
    }, 600);
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setShowResult(false);
  };

  return (
    <section id="quiz-section" className="py-12 sm:py-18 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Chapter 07</span>
            <span>•</span>
            <span>Friendship Exam</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-stone-900 font-handwriting">
            {title}
          </h2>
          <p className="text-sm sm:text-base text-stone-600 max-w-md mx-auto mt-2">
            {subtitle}
          </p>
        </div>

        {/* Quiz Card */}
        <div className="paper-card rounded-3xl p-6 sm:p-10 border-2 border-purple-200 shadow-xl relative overflow-hidden">
          {/* Top washi tape */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-6 washi-tape-lavender rounded-xs transform rotate-1" />

          {!showResult ? (
            <div>
              {/* Progress */}
              <div className="flex items-center justify-between text-xs text-purple-700 font-bold mb-6">
                <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                <span>{Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%</span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-purple-100 h-2 rounded-full mb-8 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-400 to-pink-500 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                />
              </div>

              {/* Question Text */}
              <div className="min-h-[4rem] mb-6">
                <h3 className="font-handwriting text-2xl sm:text-3xl font-bold text-stone-800 leading-snug">
                  {currentQ.question}
                </h3>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {currentQ.options.map((opt, optIdx) => {
                  const isSelected = selectedAnswers[currentQuestionIndex] === optIdx;
                  const letter = ['A', 'B', 'C', 'D'][optIdx];
                  const cleanText = opt.text.replace(/^[A-D]\.\s*/, '');

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-3 cursor-pointer ${
                        isSelected
                          ? 'bg-purple-100/90 border-purple-400 shadow-sm scale-[1.01]'
                          : 'bg-white hover:bg-purple-50/50 border-stone-200 hover:border-purple-200'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 flex-1 min-w-0">
                        <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-purple-600 text-white shadow-xs'
                            : 'bg-purple-100/80 text-purple-700'
                        }`}>
                          {letter}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-sans font-semibold text-stone-800 text-sm sm:text-base">
                            {cleanText}
                          </p>
                          {isSelected && (
                            <p className="text-xs text-purple-600 font-handwriting text-lg mt-0.5 animate-fadeIn">
                              {opt.comment}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="shrink-0">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center border text-xs ${
                          isSelected
                            ? 'bg-purple-600 text-white border-purple-600'
                            : 'border-stone-300 text-transparent'
                        }`}>
                          ✓
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Quiz Completed Screen */
            <div className="text-center py-6 animate-scaleUp">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-200 via-pink-200 to-purple-200 flex items-center justify-center text-4xl mb-4 shadow-md">
                🏆
              </div>

              <div className="inline-block px-4 py-1.5 rounded-full bg-purple-100 text-purple-800 font-bold text-xs uppercase tracking-wider mb-3">
                {completedBadge}
              </div>

              <h3 className="font-handwriting text-3xl sm:text-4xl font-bold text-stone-900 mb-4">
                Score: 100% Soulmate Material
              </h3>

              <div className="p-6 rounded-2xl bg-purple-50/70 border border-purple-200 mb-8 max-w-md mx-auto">
                <p className="font-handwriting text-2xl sm:text-3xl text-stone-800 font-bold leading-relaxed">
                  "{completedMessage}"
                </p>
              </div>

              <button
                type="button"
                onClick={handleRestart}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm shadow-md hover:shadow-purple-300 transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Take quiz again</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
