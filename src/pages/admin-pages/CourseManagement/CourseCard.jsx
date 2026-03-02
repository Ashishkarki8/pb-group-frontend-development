// c:\Users\ashis\Downloads\Pb_Group-monorepo\frontend\src\pages\admin-pages\CourseManagement\CourseCard.jsx

import React from "react";
import {
  Edit2,
  Trash2,
  Loader2,
  Eye,
  EyeOff,
  Star,
  Users,
  Clock,
  Flame,
  CalendarClock,
  CheckCircle2,
  XCircle,
  GraduationCap,
} from "lucide-react";

const STATUS_CONFIG = {
  "Coming Soon": {
    label: "Coming Soon",
    className: "bg-amber-100 text-amber-800 border border-amber-200",
    icon: CalendarClock,
  },
  "Enrolling Now": {
    label: "Enrolling Now",
    className: "bg-green-100 text-green-800 border border-green-200",
    icon: CheckCircle2,
  },
  Full: {
    label: "Full",
    className: "bg-red-100 text-red-800 border border-red-200",
    icon: XCircle,
  },
  Completed: {
    label: "Completed",
    className: "bg-gray-100 text-gray-600 border border-gray-200",
    icon: CheckCircle2,
  },
};

const LEVEL_CONFIG = {
  Beginner: { className: "bg-blue-100 text-blue-700", label: "Beginner" },
  Intermediate: {
    className: "bg-purple-100 text-purple-700",
    label: "Intermediate",
  },
  Advanced: { className: "bg-rose-100 text-rose-700", label: "Advanced" },
  "Beginner to Advanced": { className: "bg-rose-100 text-rose-700", label: "Beginner to Advanced" },
};

const CourseCard = React.memo(({
  course,
  onEdit,
  onDelete,
  onTogglePublish,
  onToggleTrending,
  isDeleting,
  isTogglingPublish,
  isTogglingTrending,
}) => {
  const statusCfg = STATUS_CONFIG[course.status] || STATUS_CONFIG["Coming Soon"];
  const levelCfg = LEVEL_CONFIG[course.level] || LEVEL_CONFIG["Beginner"];
  const StatusIcon = statusCfg.icon;

  const regularPrice = course.pricing?.regularPrice;
  const currentPrice = course.pricing?.currentPrice;
  const currency = course.pricing?.currency || "NPR";
  const hasDiscount = currentPrice !== null && currentPrice !== undefined && currentPrice < regularPrice;

  const seatsUsed = (course.seatsTotal || 0) - (course.seatsAvailable || 0);
  const seatsFillPct =
    course.seatsTotal > 0
      ? Math.round((seatsUsed / course.seatsTotal) * 100)
      : 0;

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col ${
        isDeleting ? "opacity-50 pointer-events-none" : ""
      } ${course.__optimistic ? "ring-2 ring-blue-400" : ""}`}
    >
      {/* ── Image ─────────────────────────────────────────── */}
      <div className="relative h-48 bg-gradient-to-br from-indigo-500 to-blue-600 overflow-hidden">
        {course.heroImage?.url ? (
          <img
            src={course.heroImage.url}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <GraduationCap size={56} className="text-white opacity-60" />
          </div>
        )}

        {/* Top-left: position */}
        <div className="absolute top-3 left-3">
          <span className="bg-black/60 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full font-medium">
            #{course.displayOrder ?? "—"}
          </span>
        </div>

        {/* Top-right: publish toggle */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end">
          <button
            onClick={() =>
              onTogglePublish({
                courseId: course._id,
                isPublished: !course.isPublished,
              })
            }
            disabled={isTogglingPublish || course.__optimistic}
            title={course.isPublished ? "Unpublish" : "Publish"}
            className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold shadow transition-all disabled:opacity-50 ${
              course.isPublished
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-gray-500 text-white hover:bg-gray-600"
            }`}
          >
            {isTogglingPublish ? (
              <Loader2 size={12} className="animate-spin" />
            ) : course.isPublished ? (
              <Eye size={12} />
            ) : (
              <EyeOff size={12} />
            )}
            {course.isPublished ? "Live" : "Draft"}
          </button>

          {/* Trending toggle */}
          <button
            onClick={() =>
              onToggleTrending({
                courseId: course._id,
                isTrending: !course.isTrending,
              })
            }
            disabled={isTogglingTrending || course.__optimistic}
            title={course.isTrending ? "Remove from trending" : "Mark as trending"}
            className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold shadow transition-all disabled:opacity-50 ${
              course.isTrending
                ? "bg-orange-500 text-white hover:bg-orange-600"
                : "bg-white/80 text-gray-700 hover:bg-white"
            }`}
          >
            {isTogglingTrending ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <Flame size={12} />
            )}
            {course.isTrending ? "Trending" : "Trend"}
          </button>
        </div>

        {/* Bottom: status badge */}
        <div className="absolute bottom-3 left-3">
          <span
            className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium backdrop-blur-sm ${statusCfg.className}`}
          >
            <StatusIcon size={11} />
            {statusCfg.label}
          </span>
        </div>

        {course.__optimistic && (
          <div className="absolute bottom-3 right-3 bg-blue-500 text-white text-xs px-2.5 py-1 rounded-full">
            Uploading...
          </div>
        )}
      </div>

      {/* ── Body ──────────────────────────────────────────── */}
      <div className="p-5 flex-1 flex flex-col gap-3">
        {/* Category chips + level */}
        <div className="flex flex-wrap gap-1.5 items-center">
          {(course.category || []).slice(0, 2).map((cat) => (
            <span
              key={cat}
              className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-100"
            >
              {cat}
            </span>
          ))}
          {course.category?.length > 2 && (
            <span className="text-xs text-gray-400">
              +{course.category.length - 2}
            </span>
          )}
          <span
            className={`ml-auto text-xs px-2 py-0.5 rounded-full font-medium ${levelCfg.className}`}
          >
            {levelCfg.label}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-gray-900 leading-snug line-clamp-2">
          {course.title}
        </h3>

        {/* Short description */}
        {course.subtitle && (
          <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
            {course.subtitle}
          </p>
        )}

        {/* Stats row */}
        <div className="flex items-center gap-3 text-xs text-gray-500 mt-auto">
          {/* Rating */}
          <span className="flex items-center gap-1">
            <Star size={12} className="text-amber-400 fill-amber-400" />
            <span className="font-medium text-gray-700">
              {course.rating?.average
                ? course.rating.average.toFixed(1)
                : "—"}
            </span>
            {course.rating?.count > 0 && (
              <span>({course.rating.count})</span>
            )}
          </span>

          {/* Duration */}
          {course.duration && (
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {course.duration}
            </span>
          )}

          {/* Enrollment */}
          <span className="flex items-center gap-1">
            <Users size={12} />
            {course.enrollmentCount || 0}+
          </span>
        </div>

        {/* Seats progress bar */}
        {course.seatsTotal > 0 && (
          <div>
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>
                {seatsUsed}/{course.seatsTotal} seats filled
              </span>
              <span
                className={
                  seatsFillPct >= 90
                    ? "text-red-600 font-medium"
                    : seatsFillPct >= 60
                    ? "text-amber-600 font-medium"
                    : "text-green-600 font-medium"
                }
              >
                {seatsFillPct}%
              </span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  seatsFillPct >= 90
                    ? "bg-red-500"
                    : seatsFillPct >= 60
                    ? "bg-amber-500"
                    : "bg-green-500"
                }`}
                style={{ width: `${seatsFillPct}%` }}
              />
            </div>
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-base font-bold text-gray-900">
            {currency}{" "}
            {hasDiscount
              ? currentPrice?.toLocaleString()
              : regularPrice?.toLocaleString() ?? "Free"}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">
              {currency} {regularPrice?.toLocaleString()}
            </span>
          )}
          {hasDiscount && (
            <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-medium">
              {Math.round(
                ((regularPrice - currentPrice) / regularPrice) * 100
              )}
              % off
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={() => onEdit(course)}
            disabled={isDeleting || course.__optimistic}
            className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Edit2 size={15} />
            Edit
          </button>
          <button
            onClick={() => onDelete(course._id)}
            disabled={isDeleting || course.__optimistic}
            className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Delete"
          >
            {isDeleting ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Trash2 size={15} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
});

export default CourseCard;
