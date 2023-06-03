import React, { forwardRef, ForwardRefRenderFunction, useMemo } from 'react';
import BottomSheet, { BottomSheetProps } from '@gorhom/bottom-sheet';

interface ICustomBottomModalSheetProps extends BottomSheetProps {
  handleSheetChanges?: (index: number) => void;
}

const CustomBottomModalSheet: ForwardRefRenderFunction<
  BottomSheet,
  ICustomBottomModalSheetProps
> = (
  {
    children,
    snapPoints = ['25%', '50%', '90%'],
    handleSheetChanges,
    index = 1,
    ...rest
  },
  ref,
) => {
  const memoSnapPoints = useMemo(() => snapPoints, [snapPoints]);

  return (
    <BottomSheet
      index={index}
      ref={ref}
      snapPoints={memoSnapPoints}
      onChange={handleSheetChanges}
      {...rest}>
      {children}
    </BottomSheet>
  );
};

export default forwardRef(CustomBottomModalSheet);
