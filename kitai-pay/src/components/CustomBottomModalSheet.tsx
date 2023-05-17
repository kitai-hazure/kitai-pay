import React, { useRef } from 'react';
import BottomSheet from '@gorhom/bottom-sheet';

interface ICustomBottomModalSheetProps {
  children: React.ReactNode;
  snapPoints: string[];
  handleSheetChanges: (index: number) => void;
}
const CustomBottomModalSheet = ({
  children,
  snapPoints,
  handleSheetChanges,
}: ICustomBottomModalSheetProps) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}>
      {children}
    </BottomSheet>
  );
};

export default CustomBottomModalSheet;
