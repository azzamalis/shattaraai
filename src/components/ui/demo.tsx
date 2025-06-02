
import AnimatedTextCycle from "@/components/ui/animated-text-cycle"

export function AnimatedTextCycleDemo() {
  return (
    <div className="p-4 max-w-[500px]">
        <h1 className="text-4xl font-light text-left text-muted-foreground">
            If your a <AnimatedTextCycle 
                words={[
                    "studnent",
                    "team",
                    "teacher",
                    "school",
                    "university",
                    "institution",
                    "worker",
                    "parent"
                ]}
                interval={3000}
                className={"text-foreground font-semi-bold"} 
            /> you deserves better tools
        </h1>
    </div>
  );
}
