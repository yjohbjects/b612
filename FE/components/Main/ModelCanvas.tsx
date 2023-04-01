/* eslint-disable */
import React, { useEffect, useState, useRef } from 'react';

import { useRecoilValue } from 'recoil';
import userAtom from 'store/userAtom';

import { useRouter } from 'next/navigation';
import { Canvas } from '@react-three/fiber';
import { useGLTF, Stage, PresentationControls } from '@react-three/drei';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';
import { Box3, Vector3 } from 'three';

import { PLANETS_LIST } from 'utils/utils';
import { Center } from '@react-three/drei';
import { useMyRandomPlanetAPI, useRandomUserAPI } from 'API/planetAPIs';
import { usePlanetContract } from '@components/contracts/planetToken';

function Rocket(props: any) {
  const { scene } = useGLTF('/rocket/rocket.glb');

  const clone = SkeletonUtils.clone(scene);

  //3D 모델링 리사이즈
  const bbox = new Box3().setFromObject(clone);
  const center = bbox.getCenter(new Vector3());
  const size = bbox.getSize(new Vector3());

  const maxAxis = Math.max(size.x, size.y, size.z);
  clone.scale.multiplyScalar(1 / maxAxis);
  bbox.setFromObject(clone);
  bbox.getCenter(center);
  bbox.getSize(size);
  clone.position.copy(center).multiplyScalar(-1);
  clone.position.y -= size.y * 0.5;

  return <primitive object={clone} {...props} />;
}

function Square(props: any) {
  const { scene } = useGLTF('/planet/square_preview.glb');
  const clone = SkeletonUtils.clone(scene);

  //3D 모델링 리사이즈
  const bbox = new Box3().setFromObject(clone);
  const center = bbox.getCenter(new Vector3());
  const size = bbox.getSize(new Vector3());

  const maxAxis = Math.max(size.x, size.y, size.z);
  clone.scale.multiplyScalar(1 / maxAxis);
  bbox.setFromObject(clone);
  bbox.getCenter(center);
  bbox.getSize(size);
  clone.position.copy(center).multiplyScalar(-1);
  clone.position.y -= size.y * 0.5;
  return <primitive object={clone} {...props} />;
}

function Planet(props: any) {
  // 내 행성 랜덤 id 가져오기
  const user = useRecoilValue(userAtom);
  const myRandomPlanetId = useMyRandomPlanetAPI(user?.memberId);

  const planetContract = usePlanetContract();
  const [planetDetail, setPlanetDetail] = useState(null);

  useEffect(() => {
    if (!myRandomPlanetId) return;
    planetContract?.methods
      .b612AddressMap(myRandomPlanetId)
      .call()
      .then((data: any) => {
        setPlanetDetail(data?.planetType);
      });
  }, [planetContract, myRandomPlanetId]);

  console.log(planetDetail);

  const { scene } = useGLTF(PLANETS_LIST[planetDetail || 1]);

  const clone = SkeletonUtils.clone(scene);

  //3D 모델링 리사이즈
  const bbox = new Box3().setFromObject(clone);
  const center = bbox.getCenter(new Vector3());
  const size = bbox.getSize(new Vector3());

  const maxAxis = Math.max(size.x, size.y, size.z);
  clone.scale.multiplyScalar(1 / maxAxis);
  bbox.setFromObject(clone);
  bbox.getCenter(center);
  bbox.getSize(size);
  clone.position.copy(center).multiplyScalar(-1);
  clone.position.y -= size.y * 0.5;
  return <primitive object={clone} {...props} />;
}

function RocketModel() {
  const router = useRouter();
  const user = useRecoilValue(userAtom);

  // 랜덤 프로필 id
  const randomUserId = useRandomUserAPI(user?.memberId);

  // 나의 랜덤 행성 id
  const myRandomPlanetId = useMyRandomPlanetAPI(user?.memberId);

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ fov: 45, position: [-0.05, 0, 3] }}
      style={{ position: 'fixed' }}
    >
      <Stage environment={'studio'}></Stage>

      {/* 랜덤행성으로 가는 로켓 3D */}
      <PresentationControls>
        <Rocket
          position={[-1.2, 0.35, 0.2]}
          onClick={() => router.push(`/profile/${randomUserId}`)}
        />
      </PresentationControls>

      {/* 광장 3D */}
      <PresentationControls>
        <Center
          position={[0, -0.2, 1.3]}
          onClick={() => router.push(`/square`)}
        >
          <Square />
        </Center>
      </PresentationControls>

      {/* 랜덤 내 행성 3D */}
      <PresentationControls>
        <Center
          position={[1, 0.5, 0.3]}
          onClick={() => router.push(`/planet/${myRandomPlanetId}`)}
        >
          <Planet />
        </Center>
      </PresentationControls>
    </Canvas>
  );
}

export default RocketModel;