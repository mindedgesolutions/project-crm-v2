const CFooter = () => {
  return (
    <div className="bg-muted p-4 flex flex-row justify-start items-center gap-8 pr-8">
      <h3 className="text-muted-foreground tracking-widest text-sm">
        All rights reserved &copy;{new Date().getFullYear()}
      </h3>
    </div>
  );
};
export default CFooter;
