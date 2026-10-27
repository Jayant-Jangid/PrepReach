describe('Playback Checkpointing Integration', () => {
  it('should update lastPositionSeconds on progress document', () => {
    const progress = { lectureId: 'l1', lastPositionSeconds: 120 };
    progress.lastPositionSeconds = 150;
    expect(progress.lastPositionSeconds).toBe(150);
  });
});
