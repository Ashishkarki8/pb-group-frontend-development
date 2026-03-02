// c:\Users\ashis\Downloads\Pb_Group-monorepo\frontend\src\pages\admin-pages\CourseManagement\CourseGrid.jsx

import React from "react";
import CourseCard from "./CourseCard";

const CourseGrid = ({
  courses,
  deleteMutation,
  togglePublishMutation,
  toggleTrendingMutation,
  handlers,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => {
        const isDeleting =
          deleteMutation.isPending &&
          deleteMutation.variables === course._id;

        const isTogglingPublish =
          togglePublishMutation.isPending &&
          togglePublishMutation.variables?.courseId === course._id;

        const isTogglingTrending =
          toggleTrendingMutation.isPending &&
          toggleTrendingMutation.variables?.courseId === course._id;

        return (
          <CourseCard
            key={course._id}
            course={course}
            isDeleting={isDeleting}
            isTogglingPublish={isTogglingPublish}
            isTogglingTrending={isTogglingTrending}
            {...handlers}
          />
        );
      })}
    </div>
  );
};

export default React.memo(CourseGrid);
