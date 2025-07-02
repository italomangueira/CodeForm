export const startViewTransition = (callback: () => void) => {
  if (!document.startViewTransition) {
    console.log('start view transition not supported');
    callback();
  } else {
    document.startViewTransition(callback);
  }
};
