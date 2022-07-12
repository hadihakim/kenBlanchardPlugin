describe('User Profile Controller Tests', function() {

    describe('Insights Operations', function() {

        // set Timeout before each call
        beforeEach(done => setTimeout(() => done(), 100));

        it('Init User Profile', (done) => {
            Profiles.get((error, response) => {
                expect(error).toEqual(null);
                done();
            })
        });

        it('Mark asset as active', (done) => {
            Profiles.setAssetArchiveStatus(asset.id, false, (err, resp) => {
                expect(err).toEqual(null);
                Profiles.get((error, response) => {
                    expect(error).toEqual(null);
                    expect(response.assets[asset.id].isArchived).toEqual(false);
                    done();
                })
            })
        });

        it('Mark asset as Archived', (done) => {
            Profiles.setAssetArchiveStatus(asset.id, true, (err, resp) => {
                expect(err).toEqual(null);
                Profiles.get((error, response) => {
                    expect(error).toEqual(null);
                    expect(response.assets[asset.id].isArchived).toEqual(true);
                    done();
                })
            })
        });

        it('Update Asset Progress', (done) => {
            Profiles.updateAssetProgress(asset.id, 10, (err, resp) => {
                expect(err).toEqual(null);
                Profiles.get((error, response) => {
                    expect(error).toEqual(null);
                    expect(response.assets[asset.id].progress).toEqual(10);
                    done();
                })
            })
        });

        it('reset Asset progress', (done) => {
            Profiles.resetAssetProgress(asset.id, (err, resp) => {
                expect(err).toEqual(null);
                Profiles.get((error, response) => {
                    expect(error).toEqual(null);
                    expect(response.assets[asset.id].progress).toEqual(0);
                    done();
                })
            })
        });

        it('delete User Asset', (done) => {
            Profiles.deleteAsset(asset.id, (err, resp) => {
                expect(err).toEqual(null);
                Profiles.get((error, response) => {
                    expect(error).toEqual(null);
                    expect(response.assets.id).toBeUndefined();
                    done();
                })
            })
        });

    });

    describe('Assessments Operations', function() {
        let assessmentId = "assessmentID000111"
        let assessmentResult = "Low Confidence"

        it('Add assessment result', (done) => {
            Profiles.saveAssessment(assessmentId, assessmentResult, (err, resp) => {
                expect(err).toEqual(null);
                Profiles.get((error, response) => {
                    expect(error).toEqual(null);
                    expect(response.assessments[assessmentId].result).toEqual("Low Confidence");
                    done();
                })
            })
        });

        it('retake assessment', (done) => {
            Profiles.retakeAssessment(assessmentId, (err, resp) => {
                expect(err).toEqual(null);
                Profiles.get((error, response) => {
                    expect(error).toEqual(null);
                    expect(response.assessments[assessmentId].retake).toEqual(true);
                    done();
                })
            })
        });

        it('Update assessment result', (done) => {
            Profiles.saveAssessment(assessmentId, "New Assessment result", (err, resp) => {
                expect(err).toEqual(null);
                Profiles.get((error, response) => {
                    expect(error).toEqual(null);
                    expect(response.assessments[assessmentId].result).toEqual("New Assessment result");
                    done();
                })
            })
        });

    })
});