let topicId = Utils.generateUUID();
let asset = new Video({ meta: { title: "test Video", topics: [topicId] } });
let views = {};

describe('Assets Controller Tests', function() {

    describe('Assets Operations', function() {

        // set Timeout before each call
        beforeEach(done => setTimeout(() => done(), 100));

        it('Add a new video asset', (done) => {
            Assets.add(asset, (error, response) => {
                asset.id = response.id;
                expect(error).toEqual(null);
                expect(response.id).toBeDefined();
                done();
            })
        });

        it('Sync new asset Meta to datastore settings', (done) => {
            Settings.get((err, resp) => {
                expect(resp.assets_info[asset.id]).toBeDefined();
                expect(resp.assets_info[asset.id].meta.title).toEqual("test Video");
                expect(resp.assets_info[asset.id].type).toEqual("video");
                done();
            })
        });

        it('Update Asset', (done) => {
            asset.meta.title = "New Video title";
            Assets.update(asset.id, asset, (error, response) => {
                expect(error).toEqual(null);
                expect(response.id).toBeDefined();
                done();
            })
        });

        it('Sync the update with datastore Meta', (done) => {
            Settings.get((err, resp) => {
                expect(resp.assets_info[asset.id]).toBeDefined();
                expect(resp.assets_info[asset.id].meta.title).toEqual("New Video title");
                done();
            })
        });

        it('Group assets based on topics filtered by asset types', (done) => {
            Assets.getAssetTypetPerTopicsStats("video", (err, resp) => {
                expect(err).toEqual(null);
                expect(resp).toBeDefined();
                expect(resp.find(item => item._id == topicId).count).toEqual(1);
                done();
            })
        });

        it('Get asset views stats', (done) => {
            Stats.get((err, resp) => {
                expect(Object.keys(resp).length > 0).toBeTrue();
                done();
            });
        });

        it('Increment asset views stats', (done) => {
            Assets.incrementViews(asset.id, (error, response) => {
                // we made 2 increment since the first one could be undefined
                // i.e first call to increment that asset
                Stats.get((err, resp) => {
                    views = resp.views;
                    Assets.incrementViews(asset.id, (e1, r2) => {
                        Stats.get((e1, r1) => {
                            expect(e1).toEqual(null);
                            expect(r1.views[asset.id]).toEqual(views[asset.id] + 1)
                            done();
                        });
                    })
                })
            })
        });

        it('Delete Asset', (done) => {
            Assets.delete(asset.id, (error, response) => {
                expect(error).toEqual(null);
                Assets.get(asset.id, (err, resp) => {
                    expect(resp.data).toEqual({});
                    done();
                })
            })
        });

        it('Sync the Deleted Asset with datastore', (done) => {
            Settings.get((err, resp) => {
                expect(resp.assets_info[asset.id]).toBeUndefined();
                done();
            })
        });


    });

});